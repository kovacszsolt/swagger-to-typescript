const templateMock =
    `import { {{objectName}}Interface } from '{{interfacePathSymbol}}{{filePath}}/{{fileName}}.interface';

{{#importList}}
{{#ifCond fileType "interface"}}
import { {{objectName}}Mock } from '{{../mockPathSymbol}}{{filePath}}/{{fileName}}.mock';
{{/ifCond}}
{{/importList}}

const {{objectName}}Mock: {{objectName}}Interface = {
{{#propertyList}}
{{#ifCond valueType "object"}}
    {{name}}:  {{value}}Mock,
{{/ifCond}}
{{#ifCond valueType "integer"}}
    {{name}}:  {{value}},
{{/ifCond}}
{{#ifCond valueType "string"}}
    {{name}}:  '{{value}}',
{{/ifCond}}
    {{/propertyList}}
}
`;

const templateEnum =
    `/**
 * sourceName: {{sourceName}}
 * lineNumber: {{lineNumber}}
 */

{{#if description}}/**
 * {{description}}
 */{{/if}}
export enum {{objectName}}Enum {
{{#propertyList}}
    {{name}} = {{value}},
{{/propertyList}}
}
export enum {{objectName}}EnumLabel {
{{#propertyList}}
    {{name}} = 'nxt_{{name}}',
{{/propertyList}}
}
`;

const templateModel =
    `/**
 * sourceName: {{sourceName}}
 * lineNumber: {{lineNumber}}
 */

import { {{objectName}}Interface } from '{{interfacePathSymbol}}{{filePath}}/{{fileName}}.interface';

{{#importList}}
    {{#ifCond fileType "enum"}}
import { {{objectName}}Enum } from '{{../enumPathSymbol}}{{filePath}}/{{fileName}}.enum';
    {{/ifCond}}
    {{#ifCond fileType "interface"}}
import { {{objectName}}Model } from '{{../modelPathSymbol}}{{filePath}}/{{fileName}}.model';
    {{/ifCond}}
{{/importList}}
{{#if description}}
/**
 * {{description}}
 */{{/if}}
export class {{objectName}}Model implements {{objectName}}Interface {
{{#propertyList}}
{{#if description}}
    /**
     * {{description}}
     */
{{/if}}
    {{name}}: {{typeName}}{{#ifCond type "enum"}}Enum{{/ifCond}}{{#ifCond type "object"}}Model{{/ifCond}}{{#ifCond type "array_object"}}Model[]{{/ifCond}};
{{/propertyList}}

    constructor(data: any = {}) {
        Object.assign(this, data);
{{#mapList}}
{{#ifCond type "object"}}
        if (this.{{name}}) {
            this.{{name}} = new {{source}}Model(this.{{name}});
        }
{{/ifCond}}

{{#ifCond type "array_object"}}
        if (this.{{name}}) {
            this.{{name}} = this.{{name}}.map(f => new {{source}}Model(f));
        }
{{/ifCond}}
{{/mapList}}
    }
}
`;
const templateInterface =
    `/**
 * sourceName: {{sourceName}}
 * lineNumber: {{lineNumber}}
 */
{{#importList}}
{{#ifCond fileType "enum"}}
import { {{objectName}}Enum } from '{{../enumPathSymbol}}{{filePath}}/{{fileName}}.enum';
{{/ifCond}}
    {{#ifCond fileType "interface"}}
import { {{objectName}}Interface } from '{{../interfacePathSymbol}}{{filePath}}/{{fileName}}.interface';
{{/ifCond}}
{{/importList}}
{{#if description}}
/**
 * {{description}}
 */{{/if}}
export interface {{objectName}}Interface {
{{#propertyList}}
{{#if description}}
    /**
     * {{description}}
     */
{{/if}}
    {{name}}: {{typeName}}{{#ifCond type "enum"}}Enum{{/ifCond}}{{#ifCond type "object"}}Interface{{/ifCond}}{{#ifCond type "array_object"}}Interface[]{{/ifCond}};
    {{/propertyList}}
}
`


const templateTest =
    `/**
 * sourceName: {{sourceName}}
 * lineNumber: {{lineNumber}}
 */

import { {{objectName}}Model } from '{{modelPathSymbol}}{{filePath}}/{{fileName}}.model';
import { {{objectName}}Mock } from '{{mockPathSymbol}}{{filePath}}/{{fileName}}.mock';

describe ('{{objectName}}Model', () => {

    it('create with data', () => {
        const model = new {{objectName}}Model({{objectName}}Mock);
{{#propertyList}}
        expect(model.{{name}}).toBe('{{value}}');
{{/propertyList}}
    });
    
    it('create without data', () => {
        const model = new {{objectName}}Model({{objectName}}Mock);
{{#propertyList}}
        expect(model.{{name}}).toBeUndefined();
{{/propertyList}}
    });
    
    
});
`

module.exports = {templateInterface, templateModel, templateEnum, templateMock, templateTest};
