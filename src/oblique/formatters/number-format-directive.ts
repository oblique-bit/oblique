export class NumberFormatDirective implements ng.IDirective {
    require = 'ngModel';
    
    constructor(private $filter:ng.IFilterService,
                private $parse:ng.IParseService) {

    }

    link = (scope:ng.IScope,
            element:ng.IRootElementService,
            attrs:NumberFormatDirectiveAttributes,
            ngModelController:ng.INgModelController) => {

        let decimals: number = this.$parse(attrs.decimals)(scope) || 2;

        ngModelController.$parsers.push((data:string) : number => {
            // Attempt to convert user input into a numeric type to store
            // as the model value (otherwise it will be stored as a string)
            // NOTE: Return undefined to indicate that a parse error has occurred
            //       (i.e. bad user input)
            let parsed = parseFloat(data);
            return !isNaN(parsed) ? parsed : undefined;
        });

        ngModelController.$formatters.push((data) => {
            //convert data from model format to view format
            return this.$filter('number')(data, decimals); //converted
        });

        element.bind('focus', () => {
            element.val(ngModelController.$modelValue);
        });

        element.bind('blur', () => {
            if (ngModelController.$valid) {
                // Apply formatting on the stored model value for display
                element.val(this.$filter('number')(ngModelController.$modelValue, decimals));
            }
        });
    }
}

export interface NumberFormatDirectiveAttributes extends ng.IAttributes {
    decimals:string;
}
