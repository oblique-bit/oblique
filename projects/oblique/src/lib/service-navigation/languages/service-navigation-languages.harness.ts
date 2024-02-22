import {ContentContainerComponentHarness, HarnessLoader, TestElement} from '@angular/cdk/testing';
import {MatSelectHarness} from '@angular/material/select/testing';

export class ObServiceNavigationLanguagesHarness extends ContentContainerComponentHarness {
	static hostSelector = 'ob-service-navigation-languages';

	public async getLanguageButtons(): Promise<TestElement[]> {
		return this.locatorForAll('button')();
	}

	public async getSelect(loader: HarnessLoader): Promise<MatSelectHarness> {
		return loader.getHarness(MatSelectHarness);
	}
}
