import { SharedModule } from '../../shared/shared.module';
import { Community } from '../../core/shared/community.model';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DSOSuccessResponse, ErrorResponse } from '../../core/cache/response-cache.models';
import { CommonModule } from '@angular/common';
import { CreateCommunityPageComponent } from '../../+community-page/create-community-page/create-community-page.component';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CommunityFormComponent } from '../../+community-page/community-form/community-form.component';
import { Observable } from 'rxjs/Observable';
import { CommunityDataService } from '../../core/data/community-data.service';
import { RequestError } from '../../core/data/request.models';
import { RouteService } from '../../shared/services/route.service';
import { RemoteData } from '../../core/data/remote-data';
import { CreateCollectionPageComponent } from './create-collection-page.component';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { Collection } from '../../core/shared/collection.model';
import { RouterTestingModule } from '@angular/router/testing';
import { CollectionFormComponent } from '../collection-form/collection-form.component';

describe('CreateCollectionPageComponent', () => {
  let comp: CreateCollectionPageComponent;
  let fixture: ComponentFixture<CreateCollectionPageComponent>;
  let collectionDataService: CollectionDataService;
  let communityDataService: CommunityDataService;
  let routeService: RouteService;
  let router: Router;

  const community = Object.assign(new Community(), {
    uuid: 'a20da287-e174-466a-9926-f66b9300d347',
    name: 'test community'
  });

  const collectionDataServiceStub = {
    create: (com, uuid?) => Observable.of({
      response: new DSOSuccessResponse(null,'200',null)
    })
  };
  const communityDataServiceStub = {
    findById: (uuid) => Observable.of(new RemoteData(false, false, true, null, Object.assign(new Community(), {
      uuid: uuid,
      name: community.name
    })))
  };
  const routeServiceStub = {
    getQueryParameterValue: (param) => Observable.of(community.uuid)
  };
  const routerStub = {
    navigateByUrl: (url) => url
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), SharedModule, CommonModule, RouterTestingModule],
      declarations: [CreateCollectionPageComponent, CollectionFormComponent],
      providers: [
        { provide: CollectionDataService, useValue: collectionDataServiceStub },
        { provide: CommunityDataService, useValue: communityDataServiceStub },
        { provide: RouteService, useValue: routeServiceStub },
        { provide: Router, useValue: routerStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCollectionPageComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
    collectionDataService = (comp as any).collectionDataService;
    communityDataService = (comp as any).communityDataService;
    routeService = (comp as any).routeService;
    router = (comp as any).router;
  });

  describe('onSubmit', () => {
    const data = {
      name: 'test'
    };

    it('should navigate when successful', () => {
      spyOn(router, 'navigateByUrl');
      comp.onSubmit(data);
      fixture.detectChanges();
      expect(router.navigateByUrl).toHaveBeenCalled();
    });

    it('should not navigate on failure', () => {
      spyOn(router, 'navigateByUrl');
      spyOn(collectionDataService, 'create').and.returnValue(Observable.of({
        response: Object.assign(new ErrorResponse(new RequestError()), {
          isSuccessful: false
        })
      }));
      comp.onSubmit(data);
      fixture.detectChanges();
      expect(router.navigateByUrl).not.toHaveBeenCalled();
    });
  });
});
