import {CopyDistFiles} from './steps/copy-dist-files';
import {RenameDistribution} from './steps/rename-distribution';
import {AdaptPackageJson} from './steps/adapt-package-json';
import {UpdatePaths} from './steps/update-paths';
import {AddBanner} from './steps/add-banner';
import {DistributeObFeatures} from './steps/distribute-ob-features';

CopyDistFiles.perform();
RenameDistribution.perform();
AdaptPackageJson.perform();
UpdatePaths.perform();
AddBanner.perform();
DistributeObFeatures.perform();
