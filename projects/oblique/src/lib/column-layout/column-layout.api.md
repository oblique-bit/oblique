#### ColumnLayoutComponent
|  |   |
|---|---|
| Selector | `or-column-layout` |
| Exported as | `orColumnLayout` |

##### Inputs
|  |   |
|---|---|
| `left` | Defines if the left panel should be rendered.<br><br>*Type:* `boolean` *Default value:* `true`|
| `right` | Defines if the right panel should be rendered.<br><br>*Type:* `boolean` *Default value:* `true`|

##### Content projection
|  |   |
|---|---|
| `[column-left-content]` | Selects the content to project into the left panel. |
| `[column-main-content]` | Selects the content to project into the main panel. |
| `[column-right-content]` | Selects the content to project into the right panel. |

##### Methods
|  |   |
|---|---|
| `toggleLeft()` | *Returns:* `void` <br> Toggles the left panel. |
| `toggleRight()` | *Returns:* `void` <br> Toggles the right panel. |

##### Internationalization
|  |   |
|---|---|
| `i18n.oblique.column.left.toggle` | Screen-reader only label for the left toggle button. |
| `i18n.oblique.column.right.toggle` | Screen-reader only label for the right toggle button. |
