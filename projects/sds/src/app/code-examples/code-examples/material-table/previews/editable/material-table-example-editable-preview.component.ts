import {Component, OnInit, inject} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import {ObButtonModule, WINDOW} from '@oblique/oblique';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MockBackEndService, PeriodicElement} from './mock-backend.service';
import {AppMaterialTableExampleEditableDialogComponent} from './material-table-editable-dialog.component';

@Component({
	selector: 'app-material-table-example-editable-preview',
	templateUrl: './material-table-example-editable-preview.component.html',
	styleUrls: ['./material-table-example-editable-preview.component.scss'],
	imports: [MatTableModule, MatButtonModule, ObButtonModule, MatIconModule, MatDialogModule],
	standalone: true
})
export class MaterialTableExampleEditablePreviewComponent implements OnInit {
	public displayedColumns: string[] = ['position', 'name', 'weight', 'symbol', 'actions'];
	public dataSource = new MatTableDataSource<PeriodicElement>();

	private readonly dialog = inject(MatDialog);
	private readonly mockBackEndService = new MockBackEndService();
	private readonly window = inject(WINDOW);

	ngOnInit(): void {
		this.getData();
	}

	getData(): void {
		this.mockBackEndService.getData().subscribe(data => {
			this.dataSource.data = data;
		});
	}

	editRow(element: PeriodicElement): void {
		const dialogRef = this.dialog.open(AppMaterialTableExampleEditableDialogComponent, {data: element});

		dialogRef.afterClosed().subscribe((updatedElement: PeriodicElement) => {
			if (updatedElement) {
				this.mockBackEndService.updateData(updatedElement);
				this.getData();
			}
		});
	}

	deleteRow(element: PeriodicElement): void {
		if (this.window.confirm(`Please confirm that you want to delete ${element.name}.`)) {
			this.mockBackEndService.removeData(element);
			this.getData();
		}
	}
}
