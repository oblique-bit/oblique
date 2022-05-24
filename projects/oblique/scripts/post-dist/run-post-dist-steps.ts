import {CopyDistFiles} from './steps/copy-dist-files';
import {RenameDistribution} from './steps/rename-distribution';
import {AdaptPackageJson} from './steps/adapt-package-json';
import {GenerateComponentStyles} from './steps/generate-component-styles';
import {UpdatePaths} from './steps/update-paths';
import {AddBanner} from './steps/add-banner';

CopyDistFiles.perform();
RenameDistribution.perform();
AdaptPackageJson.perform();
GenerateComponentStyles.perform();
UpdatePaths.perform();
AddBanner.perform();
