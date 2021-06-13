import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormArray, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { NavigationService } from 'src/app/services/navigation.service';
import { RepositoryService } from 'src/app/services/repository.service';

import { FormComponent } from './form.component';

class RepositoryServiceStub {
  savePins() {
    return of(true);
  }
}

class NavigationServiceStub {
  gotToPins() {}
}

class MatSnackBarStub {
  open() {
    return {
      afterDismissed: () => {
        return of(true);
      },
    };
  }
}

fdescribe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FormComponent],
      providers: [
        { provide: RepositoryService, useClass: RepositoryServiceStub },
        { provide: NavigationService, useClass: NavigationServiceStub },
        { provide: MatSnackBar, useClass: MatSnackBarStub },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  fdescribe('When component is initializated', () => {
    it('should create the forms', () => {
      console.log(component.firstFormGroup.controls);
      expect(Object.keys(component.firstFormGroup.controls)).toEqual([
        'title',
        'author',
        'description',
      ]);
      expect(Object.keys(component.secondFormGroup.controls)).toEqual([
        'firstAsset',
        'assets',
      ]);
    });
  });

  fdescribe('when addAsset is executed', () => {
    it('chould hace new group', () => {
      const assets = <FormArray>component.secondFormGroup.get('assets');

      component.addAsset();
      component.addAsset();

      console.log(Object.keys(assets.controls));
      expect(Object.keys(assets.controls)).toEqual(['0', '1']);
    });
  });

  fdescribe('when delete asset', () => {
    it('should remove the form control', () => {
      const assets = <FormArray>component.secondFormGroup.get('assets');

      component.addAsset();
      component.deleteAsset(0);

      expect(Object.keys(assets.controls)).toEqual([]);
    });
  });

  fdescribe('when savePins is executed ', () => {
    it('should navigate to pins view', () => {
      const navigate = spyOn((<any>component).navigate, 'goToPins');
      const open = spyOn((<any>component).snackBar, 'open').and.callThrough();

      component.savePin();

      expect(navigate).toHaveBeenCalled();
      expect(open).toHaveBeenCalledOnceWith(
        'Your pin is saved, Redirecting ...',
        'Cool!',
        {
          duration: 2000,
        }
      );
    });
  });
});
