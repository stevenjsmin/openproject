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

import {KeepTabService} from '../../wp-single-view-tabs/keep-tab/keep-tab.service';
import {States} from '../../states.service';
import {WorkPackageTableFocusService} from 'core-components/wp-fast-table/state/wp-table-focus.service';
import {StateService, TransitionService} from '@uirouter/core';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractWorkPackageButtonComponent} from 'core-components/wp-buttons/wp-buttons.module';
import {I18nService} from "core-app/modules/common/i18n/i18n.service";
import {untilComponentDestroyed} from "ng2-rx-componentdestroyed";
import {
  WorkPackageDisplayRepresentationService,
  wpDisplayCardRepresentation
} from "core-components/wp-fast-table/state/work-package-display-representation.service";

@Component({
  templateUrl: '../wp-button.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'wp-details-view-button',
})
export class WorkPackageDetailsViewButtonComponent extends AbstractWorkPackageButtonComponent implements OnInit, OnDestroy {
  public projectIdentifier:string;
  public accessKey:number = 8;
  public activeState:string = 'work-packages.list.details';
  public listState:string = 'work-packages.list';
  public buttonId:string = 'work-packages-details-view-button';
  public buttonClass:string = 'toolbar-icon';
  public iconClass:string = 'icon-info2';

  public activateLabel:string;
  public deactivateLabel:string;

  private transitionListener:Function;

  constructor(
    readonly $state:StateService,
    readonly I18n:I18nService,
    readonly transitions:TransitionService,
    readonly cdRef:ChangeDetectorRef,
    public states:States,
    public wpTableFocus:WorkPackageTableFocusService,
    public keepTab:KeepTabService,
    public wpDisplayRepresentationService:WorkPackageDisplayRepresentationService) {

    super(I18n);

    this.activateLabel = I18n.t('js.button_open_details');
    this.deactivateLabel = I18n.t('js.button_close_details');

    this.transitionListener = this.transitions.onSuccess({}, () => {
      this.isActive = this.$state.includes(this.activeState);
      this.cdRef.detectChanges();
    });
  }

  public ngOnInit() {
    this.wpDisplayRepresentationService.live$()
      .pipe(
        untilComponentDestroyed(this)
      )
      .subscribe(() => {
        this.disabled = this.wpDisplayRepresentationService.current === wpDisplayCardRepresentation;
        this.cdRef.detectChanges();
      });
  }

  public ngOnDestroy() {
    this.transitionListener();
  }

  public get label():string {
    if (this.isActive) {
      return this.deactivateLabel;
    } else {
      return this.activateLabel;
    }
  }

  public isToggle():boolean {
    return true;
  }

  public performAction(event:Event) {
    if (this.isActive) {
      this.openListView();
    } else {
      this.openDetailsView();
    }
  }

  public openListView() {
    var params = {
      projectPath: this.projectIdentifier
    };

    _.extend(params, this.$state.params);
    this.$state.go(this.listState, params);
  }

  public openDetailsView() {
    var params = {
      workPackageId: this.wpTableFocus.focusedWorkPackage,
      projectPath: this.projectIdentifier,
    };

    _.extend(params, this.$state.params);
    this.$state.go(this.keepTab.currentDetailsState, params);
  }
}
