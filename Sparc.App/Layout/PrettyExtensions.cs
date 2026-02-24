namespace Sparc.App;

public static class PrettyExtensions
{
    public static string Pretty(this float? value)
        => value == null ? "N/A"
        : value.Value.Pretty();

    public static string Pretty(this float value)
    {
        if (value >= 1_000_000_000)
            return $"{value / 1_000_000_000:0.#}b";
        if (value >= 1_000_000)
            return $"{value / 1_000_000:0.#}m";
        if (value >= 1_000)
            return $"{value / 1_000:0.#}k";

        return value.ToString("0.##");
    }
}
