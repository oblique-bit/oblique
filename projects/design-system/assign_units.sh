#!/bin/bash

# Assignment Strategy:
# PX: borders (detail), focus rings, shadows, small icons
# REM: spacing (layout), large components, scalable elements

echo "🔄 Applying unit-specific dimension assignments..."

# Replace the primitive dimension.json with unit-specific structure
cp "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/primitive/dimension-units.json" "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/primitive/dimension.json"

# SPACING - ALL REM (should scale with font size for better UX)
echo "📏 Updating spacing tokens to use rem..."
sed -i '' 's/{ob\.p\.dimension\.0}/{ob.p.dimension.rem.0}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/desktop.json"
sed -i '' 's/{ob\.p\.dimension\.25}/{ob.p.dimension.rem.25}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/desktop.json"
sed -i '' 's/{ob\.p\.dimension\.50}/{ob.p.dimension.rem.50}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/desktop.json"
sed -i '' 's/{ob\.p\.dimension\.75}/{ob.p.dimension.rem.75}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/desktop.json"
sed -i '' 's/{ob\.p\.dimension\.100}/{ob.p.dimension.rem.100}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/desktop.json"
sed -i '' 's/{ob\.p\.dimension\.125}/{ob.p.dimension.rem.125}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/desktop.json"
sed -i '' 's/{ob\.p\.dimension\.150}/{ob.p.dimension.rem.150}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/desktop.json"
sed -i '' 's/{ob\.p\.dimension\.200}/{ob.p.dimension.rem.200}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/desktop.json"
sed -i '' 's/{ob\.p\.dimension\.250}/{ob.p.dimension.rem.250}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/desktop.json"
sed -i '' 's/{ob\.p\.dimension\.300}/{ob.p.dimension.rem.300}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/desktop.json"
sed -i '' 's/{ob\.p\.dimension\.350}/{ob.p.dimension.rem.350}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/desktop.json"
sed -i '' 's/{ob\.p\.dimension\.400}/{ob.p.dimension.rem.400}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/desktop.json"
sed -i '' 's/{ob\.p\.dimension\.450}/{ob.p.dimension.rem.450}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/desktop.json"
sed -i '' 's/{ob\.p\.dimension\.500}/{ob.p.dimension.rem.500}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/desktop.json"
sed -i '' 's/{ob\.p\.dimension\.600}/{ob.p.dimension.rem.600}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/desktop.json"
sed -i '' 's/{ob\.p\.dimension\.800}/{ob.p.dimension.rem.800}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/desktop.json"
sed -i '' 's/{ob\.p\.dimension\.1000}/{ob.p.dimension.rem.1000}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/desktop.json"

# Mobile spacing - same rem assignments
sed -i '' 's/{ob\.p\.dimension\.0}/{ob.p.dimension.rem.0}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/mobile.json"
sed -i '' 's/{ob\.p\.dimension\.25}/{ob.p.dimension.rem.25}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/mobile.json"
sed -i '' 's/{ob\.p\.dimension\.50}/{ob.p.dimension.rem.50}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/mobile.json"
sed -i '' 's/{ob\.p\.dimension\.75}/{ob.p.dimension.rem.75}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/mobile.json"
sed -i '' 's/{ob\.p\.dimension\.100}/{ob.p.dimension.rem.100}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/mobile.json"
sed -i '' 's/{ob\.p\.dimension\.125}/{ob.p.dimension.rem.125}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/mobile.json"
sed -i '' 's/{ob\.p\.dimension\.150}/{ob.p.dimension.rem.150}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/mobile.json"
sed -i '' 's/{ob\.p\.dimension\.200}/{ob.p.dimension.rem.200}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/mobile.json"
sed -i '' 's/{ob\.p\.dimension\.250}/{ob.p.dimension.rem.250}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/mobile.json"
sed -i '' 's/{ob\.p\.dimension\.300}/{ob.p.dimension.rem.300}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/mobile.json"
sed -i '' 's/{ob\.p\.dimension\.350}/{ob.p.dimension.rem.350}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/mobile.json"
sed -i '' 's/{ob\.p\.dimension\.400}/{ob.p.dimension.rem.400}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/mobile.json"
sed -i '' 's/{ob\.p\.dimension\.450}/{ob.p.dimension.rem.450}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/mobile.json"
sed -i '' 's/{ob\.p\.dimension\.500}/{ob.p.dimension.rem.500}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/spacing/mobile.json"

# SIZING - MIXED (borders=px, icons=px, larger scalable elements=rem)
echo "📐 Updating sizing tokens with appropriate units..."

# Detail borders - ALL PX (need precision)
sed -i '' 's/{ob\.p\.dimension\.0}/{ob.p.dimension.px.0}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json"
sed -i '' 's/{ob\.p\.dimension\.12}/{ob.p.dimension.px.12}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json"
sed -i '' 's/{ob\.p\.dimension\.25}/{ob.p.dimension.px.25}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json"
sed -i '' 's/{ob\.p\.dimension\.37}/{ob.p.dimension.px.37}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json"
sed -i '' 's/{ob\.p\.dimension\.50}/{ob.p.dimension.px.50}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json"
sed -i '' 's/{ob\.p\.dimension\.75}/{ob.p.dimension.px.75}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json"

# Element sizes - MIXED: small icons=px, larger scalable=rem
sed -i '' 's/{ob\.p\.dimension\.100}/{ob.p.dimension.px.100}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json" # small icons
sed -i '' 's/{ob\.p\.dimension\.125}/{ob.p.dimension.px.125}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json" # compact icons
sed -i '' 's/{ob\.p\.dimension\.150}/{ob.p.dimension.px.150}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json" # medium icons
sed -i '' 's/{ob\.p\.dimension\.200}/{ob.p.dimension.px.200}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json" # standard icons

# Larger sizes that should scale - REM
sed -i '' 's/{ob\.p\.dimension\.250}/{ob.p.dimension.rem.250}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json"
sed -i '' 's/{ob\.p\.dimension\.300}/{ob.p.dimension.rem.300}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json"
sed -i '' 's/{ob\.p\.dimension\.350}/{ob.p.dimension.rem.350}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json"
sed -i '' 's/{ob\.p\.dimension\.400}/{ob.p.dimension.rem.400}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json"
sed -i '' 's/{ob\.p\.dimension\.450}/{ob.p.dimension.rem.450}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json"
sed -i '' 's/{ob\.p\.dimension\.600}/{ob.p.dimension.rem.600}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json"
sed -i '' 's/{ob\.p\.dimension\.800}/{ob.p.dimension.rem.800}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json"
sed -i '' 's/{ob\.p\.dimension\.1000}/{ob.p.dimension.rem.1000}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json"
sed -i '' 's/{ob\.p\.dimension\.1200}/{ob.p.dimension.rem.1200}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json"
sed -i '' 's/{ob\.p\.dimension\.2000}/{ob.p.dimension.rem.2000}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json"
sed -i '' 's/{ob\.p\.dimension\.3600}/{ob.p.dimension.rem.3600}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/sizing.json"

# COMPONENTS - Icons should be PX (standard platform sizes)
echo "🎯 Updating component tokens..."
sed -i '' 's/{ob\.p\.dimension\.175}/{ob.p.dimension.px.175}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/component/atom/icon_holder/sm.json"
sed -i '' 's/{ob\.p\.dimension\.200}/{ob.p.dimension.px.200}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/component/atom/icon_holder/sm.json"
sed -i '' 's/{ob\.p\.dimension\.250}/{ob.p.dimension.px.250}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/component/atom/icon_holder/sm.json"

sed -i '' 's/{ob\.p\.dimension\.200}/{ob.p.dimension.px.200}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/component/atom/icon_holder/md.json"
sed -i '' 's/{ob\.p\.dimension\.300}/{ob.p.dimension.px.300}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/component/atom/icon_holder/md.json"

sed -i '' 's/{ob\.p\.dimension\.250}/{ob.p.dimension.px.250}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/component/atom/icon_holder/lg.json"
sed -i '' 's/{ob\.p\.dimension\.350}/{ob.p.dimension.px.350}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/component/atom/icon_holder/lg.json"

# SHADOWS - PX (need visual precision)
echo "🌑 Updating shadow tokens..."
sed -i '' 's/{ob\.p\.dimension\.75}/{ob.p.dimension.px.75}/g' "/Users/davorradisic/vc git repo bit/oblique/projects/design-system/src/lib/themes/semantic/shadow.json"

echo "✅ Unit-specific dimension assignments complete!"
echo ""
echo "📊 Assignment Summary:"
echo "• Spacing: ALL REM (scales with font size)"
echo "• Borders/Details: ALL PX (needs precision)"
echo "• Small Icons: PX (standard platform sizes)"
echo "• Large Components: REM (scalable with user preferences)"
echo "• Shadows: PX (visual precision)"
