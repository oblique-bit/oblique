<ac:layout>
  <ac:layout-section ac:type="two_equal">
    <ac:layout-cell>
      <p data-nh-numbering="1. ">
        <strong>
          <ac:structured-macro ac:macro-id="b491de32-74f6-4abd-8819-ea2c9c673543" ac:name="status" ac:schema-version="1">
            <ac:parameter ac:name="colour">Yellow</ac:parameter>
            <ac:parameter ac:name="title">In review</ac:parameter>
          </ac:structured-macro>
        </strong>
      </p>
      <h1 data-nh-numbering="1. ">
        <strong>Introduction</strong>
      </h1>
      <p>
        <br/>
      </p>
      <p>
        <strong>About this document: </strong>This document helps developers understand which tokens to use for media queries, along with the viewport strategy, token structure, and themes in Figma and Tokens Studio.</p>
      <p>
        <strong>Scope: </strong>Tokenized DesignSystem only. Pre DesignSystem releases like Oblique R13 are not affected.</p>
      <p>
        <strong>Viewport Strategy: </strong>The tokenized system currently supports two viewports: desktop and mobile.</p>
      <h1 data-nh-numbering="2. ">
        <strong>Primitive Responsive Tokens</strong>
      </h1>
      <h2 data-nh-numbering="2.1. ">
        <strong>
          <code>ob.p.breakpoint</code>
        </strong>
      </h2>
      <ul>
        <li>A full set of primitive breakpoint tokens is defined, e.g., 640px, 768px, 1024px, 1280px, 1536px</li>
        <li>Not all are in use yet, but they provide a consistent base for scaling.</li>
        <li>Alias token only. Do not use in code.</li>
      </ul>
      <h1 data-nh-numbering="3. ">
        <strong>Semantic Responsive Tokens </strong>
      </h1>
      <h2 data-nh-numbering="3.1. ">
        <code>
          <strong>ob.s.media.breakpoint</strong>
        </code>
      </h2>
      <ul>
        <li>mainly used by developers for media query. </li>
        <li>In the <strong>desktop </strong>theme, it uses a <code>min-width</code> rule</li>
        <li>In the <strong>mobile </strong>theme, the value <code>0px</code> is assigned as a fallback, since no media query is needed and the theme applies to all viewports by default.</li>
      </ul>
      <table class="wrapped">
        <thead class="">
          <tr class="">
            <th>Theme</th>
            <th>Semantic Token</th>
            <th>References Primitive</th>
            <th>Resolved Value</th>
          </tr>
        </thead>
        <tbody class="">
          <tr class="">
            <td>Desktop</td>
            <td>
              <code>ob.s.media.breakpoint</code>
            </td>
            <td>
              <code>{ob.p.breakpoint.768}</code>
            </td>
            <td>
              <code>(min-width: 768px)</code>
            </td>
          </tr>
          <tr class="">
            <td>Mobile</td>
            <td>
              <code>ob.s.media.breakpoint</code>
            </td>
            <td>
              <code>{ob.p.breakpoint.0}</code>
            </td>
            <td>
              <code>(min-width: 0px)</code>
            </td>
          </tr>
        </tbody>
      </table>
      <h2 data-nh-numbering="3.2. ">
        <code>
          <strong>ob.s.media.viewport</strong>
        </code>
      </h2>
      <p>The token <code>ob.s.media.viewport</code> is used primarily as a variable in Figma. It enables component variants to respond to the active viewport. Its value always matches the name of the active theme:</p>
      <p>"mobile" in the mobile theme</p>
      <p>"desktop" in the desktop theme</p>
      <p>Usage example</p>
      <ul>
        <li>Figma component "button/container"</li>
        <li>Component variant:  <code>viewport=mobile, buttons-order=primary-first, buttons=3, size=md, has-primary=true</code>
        </li>
        <li>What it does: enforces vertical stacking and full-width layout for buttons, on mobile viewport only (<code>property=mobile</code>).</li>
      </ul>
      <hr/>
      <p>
        <br/>
      </p>
    </ac:layout-cell>
    <ac:layout-cell>
      <h1 data-nh-numbering="4. ">
        <strong>Research Insights</strong>
      </h1>
      <p>
        <em>For reference only.</em>
      </p>
      <h2 data-nh-numbering="4.1. ">
        <strong>Analytics &amp; Current Device Landscape</strong>
      </h2>
      <table class="wrapped">
        <thead class="">
          <tr class="">
            <th>Device</th>
            <th>Screen Width (px)</th>
            <th>Classification</th>
          </tr>
        </thead>
        <tbody class="">
          <tr class="">
            <td>iPhone SE (1st/2nd Gen)</td>
            <td>320 / 375</td>
            <td>Mobile</td>
          </tr>
          <tr class="">
            <td>iPhone 13/14/15</td>
            <td>390</td>
            <td>Mobile</td>
          </tr>
          <tr class="">
            <td>Google Pixel 7</td>
            <td>412</td>
            <td>Mobile</td>
          </tr>
          <tr class="">
            <td>Samsung Galaxy S22</td>
            <td>360</td>
            <td>Mobile</td>
          </tr>
          <tr class="">
            <td>iPad (9.7", portrait)</td>
            <td>768</td>
            <td>Tablet/Desktop Base</td>
          </tr>
          <tr class="">
            <td>iPad Pro 11" (portrait)</td>
            <td>834</td>
            <td>Tablet/Desktop</td>
          </tr>
          <tr class="">
            <td>iPad Pro 12.9" (portrait)</td>
            <td>1024</td>
            <td>Tablet/Desktop</td>
          </tr>
          <tr class="">
            <td>MacBook Air/Pro</td>
            <td>≥1280</td>
            <td>Desktop</td>
          </tr>
          <tr class="">
            <td>Common desktop monitor</td>
            <td>≥1440</td>
            <td>Desktop</td>
          </tr>
        </tbody>
      </table>
      <h2 data-nh-numbering="4.2. ">
        <strong>Industry Standards</strong>
      </h2>
      <table class="wrapped">
        <thead class="">
          <tr class="">
            <th>Design System</th>
            <th>Mobile Max</th>
            <th>Desktop Min</th>
          </tr>
        </thead>
        <tbody class="">
          <tr class="">
            <td>Bootstrap</td>
            <td>767px</td>
            <td>768px</td>
          </tr>
          <tr class="">
            <td>Tailwind CSS</td>
            <td>639px</td>
            <td>640px</td>
          </tr>
          <tr class="">
            <td>Material Design</td>
            <td>599px</td>
            <td>600px+ (Tablet), 840px (Desktop)</td>
          </tr>
          <tr class="">
            <td>Apple HIG</td>
            <td>~767px</td>
            <td>~768px</td>
          </tr>
          <tr class="">
            <td>IBM Carbon</td>
            <td>672px</td>
            <td>1056px</td>
          </tr>
        </tbody>
      </table>
    </ac:layout-cell>
  </ac:layout-section>
</ac:layout>
