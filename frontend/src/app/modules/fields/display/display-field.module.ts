// -- copyright
// OpenProject is a project management system.
// Copyright (C) 2012-2015 the OpenProject Foundation (OPF)
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License version 3.
//
// OpenProject is a fork of ChiliProject, which is a fork of Redmine. The copyright follows:
// Copyright (C) 2006-2013 Jean-Philippe Lang
// Copyright (C) 2010-2013 the ChiliProject Team
//
// This program is free software; you can redistribute it and/or
// modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation; either version 2
// of the License, or (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
//
// See doc/COPYRIGHT.rdoc for more details.
// ++

import {Field, IFieldSchema} from "core-app/modules/fields/field.base";
import {WorkPackageChangeset} from "core-components/wp-edit-form/work-package-changeset";
import {I18nService} from "core-app/modules/common/i18n/i18n.service";
import {DisplayFieldContext} from "core-app/modules/fields/display/display-field.service";

export const cssClassCustomOption = 'custom-option';

export class DisplayField extends Field {
  public static type:string;
  public mode:string | null = null;
  public changeset:WorkPackageChangeset|null = null;

  protected I18n:I18nService = this.$injector.get(I18nService);

  constructor(public name:string, public context:DisplayFieldContext) {
    super();
  }

  /**
   * Apply the display field to the given resource and schema
   * @param resource
   * @param schema
   */
  public apply(resource:any, schema:IFieldSchema) {
    this.resource = resource;
    this.schema = schema;
  }

  public texts = {
    empty: this.I18n.t('js.work_packages.no_value'),
    placeholder: this.I18n.t('js.placeholders.default')
  };

  public get isFormattable():boolean {
    return false;
  }

  /**
   * Return the provided local injector,
   * which is relevant to provide the display field
   * the current space context.
   */
  protected get $injector() {
    return this.context.injector;
  }

  public get value() {
    if (!this.schema) {
      return null;
    }

    if (this.changeset) {
      return this.changeset.value(this.name);
    }
    else {
      return this.attribute;
    }
  }

  protected get attribute() {
    return this.resource[this.name];
  }

  public get type():string {
    return (this.constructor as typeof DisplayField).type;
  }

  public get valueString():string {
    return this.value;
  }

  public get placeholder():string {
    return '-';
  }

  public get label() {
    return (this.schema.name || this.name);
  }

  public get title():string|null {

    // Don't return a value for long text fields,
    // since they shouldn't / won't be truncated.
    if (this.isFormattable) {
      return null;
    }

    return this.valueString;
  }

  public render(element:HTMLElement, displayText:string):void {
    element.textContent = displayText;
  }

  /**
   * Render an empty placeholder if no values are present
   */
  public renderEmpty(element:HTMLElement) {
    const emptyDiv = document.createElement('div');
    emptyDiv.setAttribute('title', this.texts.empty);
    emptyDiv.textContent = this.texts.placeholder;
    emptyDiv.classList.add(cssClassCustomOption, '-empty');

    element.appendChild(emptyDiv);
  }
}
