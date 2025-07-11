using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.Extensions.Caching.Hybrid;
using Microsoft.Net.Http.Headers;
using Sparc.Blossom.Data;
using Sparc.Engine;

namespace Sparc.Aura;

public class SparcAuraDomainPolicyProvider(IRepository<SparcDomain> domains, HybridCache cache) : ICorsPolicyProvider
{
    static CorsPolicy AllowAll = new CorsPolicyBuilder()
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader()
        .Build();

    static CorsPolicy DenyAll = new CorsPolicyBuilder()
        .Build();

    static Dictionary<string, CorsPolicy> _policies = [];

    public async Task<CorsPolicy?> GetPolicyAsync(HttpContext context, string? policyName)
    {
        if (policyName == null)
            return AllowAll;

        var currentDomain = context.Request.Headers.Origin.ToString();
        var domain = await cache.GetOrCreateAsync(currentDomain, async _ => await GetOrAddDomainAsync(currentDomain), new HybridCacheEntryOptions { Expiration = TimeSpan.FromMinutes(5) });
        if (!domain.HasProduct(policyName))
            return DenyAll;

        if (_policies.TryGetValue(domain.Domain, out var existingPolicy))
            return existingPolicy;

        var newPolicy = new CorsPolicyBuilder()
            .WithOrigins(domain.Domain)
            .WithMethods("GET", "POST")
            .WithHeaders(HeaderNames.ContentType, HeaderNames.AcceptLanguage)
            .AllowCredentials();
       
        _policies.TryAdd(currentDomain, newPolicy.Build());
        return _policies[currentDomain];
    }

    async Task<SparcDomain> GetOrAddDomainAsync(string domain)
    {
        var existing = await domains.Query
            .Where(d => d.Domain == domain)
            .FirstOrDefaultAsync();

        if (existing == null)
        {
            existing = new(domain);
            await domains.AddAsync(existing);
        }

        return existing;
    }
}
