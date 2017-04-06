import {TestBed, ComponentFixture, async} from '@angular/core/testing';
import {MultiselectComponent} from './multiselect.component';
import {FormsModule} from '@angular/forms';
import {Pipe, PipeTransform} from "@angular/core";
import {MultiselectConfig} from "./multiselect.config";

describe('MultiselectComponent', () => {
    let fixture: ComponentFixture<MultiselectComponent>;
    let component: MultiselectComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MultiselectComponent, MockSearchPipe],
            imports: [FormsModule],
            providers: [
                MultiselectConfig
            ]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MultiselectComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

@Pipe({
    name: 'searchFilter'
})
class MockSearchPipe implements PipeTransform {
    transform(value: any, args: any): any {
        return value;
    }
}
