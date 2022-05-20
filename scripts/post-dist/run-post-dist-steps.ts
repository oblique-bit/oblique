import {CopyDistFiles} from './steps/copy-dist-files';
import {FindAndReplace} from './steps/find-and-replace';
import {AdaptPackageJson} from './steps/adapt-package-json';
import {GenerateComponentStyles} from './steps/generate-component-styles';
import {UpdatePaths} from './steps/update-paths';
import {AddBanner} from './steps/add-banner';

CopyDistFiles.perform();
FindAndReplace.perform();
AdaptPackageJson.perform();
GenerateComponentStyles.perform();
UpdatePaths.perform();
AddBanner.perform();
