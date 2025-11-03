import {Component} from '@angular/core';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';

@Component({
	selector: 'app-expansion-panel-example-basic-preview',
	imports: [MatExpansionModule, MatFormFieldModule, MatInputModule, FormsModule, MatSelectModule],
	templateUrl: './expansion-panel-example-basic-preview.component.html'
})
export class ExpansionPanelExampleBasicPreviewComponent {
	heroName = 'Super*';
	heroPower = 'invisibility';
}
