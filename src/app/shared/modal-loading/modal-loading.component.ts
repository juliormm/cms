import { Component, OnInit, ViewChild, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
import { DynamicModalService } from '../../core/dynamic-modal.service';


@Component({
  selector: 'modal-loading',
  template: `<ng-template #modalDrop></ng-template>`,
  styleUrls: ['./modal-loading.component.scss']
})
export class ModalLoadingComponent implements OnInit {

  @ViewChild('modalDrop', { read: ViewContainerRef }) modalDrop;

  componentSelected: any;

  constructor(private _componentFactoryResolver: ComponentFactoryResolver, private _modService: DynamicModalService) {}

  ngOnInit() {
    this._modService.startModal$.subscribe(data => {
      if (data.component) {
        this.componentSelected = data.component;
        this.loadComponent();
      }
    });

    this._modService.closeModal$.subscribe(data => {
      this.componentSelected = null;
      this.modalDrop.clear();
    });
  }

  loadComponent() {
    if (this.componentSelected) {
      const componentFactory = this._componentFactoryResolver.resolveComponentFactory(this.componentSelected);
      this.modalDrop.clear();
      const componentRef = this.modalDrop.createComponent(componentFactory);
    }
  }
}
