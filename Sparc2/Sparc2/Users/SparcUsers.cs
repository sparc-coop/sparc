using Sparc.Blossom.Authentication;

namespace Sparc.Engine;

public class SparcUsers(BlossomAggregateOptions<BlossomUser> options)
    : BlossomAggregate<BlossomUser>(options), IBlossomEndpoints
{
    public void Map(IEndpointRouteBuilder endpoints)
    {
        //var user = endpoints.MapGroup("/user").RequireCors("Auth");
        //user.MapPost("update-user", async (SparcAuthenticator<T> auth, ClaimsPrincipal principal, [FromBody] UpdateUserRequest request) => await auth.UpdateUserAsync(principal, request));
        //user.MapPost("verify-code", async (SparcAuthenticator<T> auth, ClaimsPrincipal principal, [FromBody] VerificationRequest request) => await auth.VerifyCodeAsync(principal, request.EmailOrPhone, request.Code));
        //user.MapPost("update-avatar", async (SparcAuthenticator<T> auth, ClaimsPrincipal principal, [FromBody] UpdateAvatarRequest request) => await auth.UpdateAvatarAsync(principal, request));

    }
}
