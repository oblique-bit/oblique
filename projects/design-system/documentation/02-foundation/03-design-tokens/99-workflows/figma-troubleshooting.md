# Figma Troubleshooting

## Component Modes (sm, md, lg, color) Not Available

If a component in Figma does not offer modes like `sm`, `md`, `lg`, or color modes, it can mean that there is a parallel source of these variables that are static (not "mode-able") coming, for example, from a "core" collection.

In most cases, you have to disable the token set (the JSON file) for that theme group in the Tokens Studio plugin to resolve the conflict.
