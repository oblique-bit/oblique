#### DropdownComponent
|  |   |
|---|---|
| Selector | `or-dropdown` |
| Exported as | `orDropdown` |

##### Inputs
|  |   |
|---|---|
| `position` | Defines the position of the dropdown according to its toggle. Possible values are `right`, `middle`, `left`.<br><br>*Type:* `string` *Default value:* `middle`|

##### Content projection
|  |   |
|---|---|
| `[dropdown-toggle]` | Selects the content to be projected as the toggle button. It will always be visible |
| `[dropdown-content]` | Selects the content to be projected in the dropdown panel. It will only be visible when the dropdown is opened. |

##### Methods
|  |   |
|---|---|
| `toggle()` | *Returns:* `void` <br> Toggles the dropdown. |
