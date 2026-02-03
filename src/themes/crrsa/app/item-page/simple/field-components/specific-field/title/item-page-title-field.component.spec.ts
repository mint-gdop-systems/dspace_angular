import {
  ChangeDetectionStrategy,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import {
  ComponentFixture,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';
import {
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';

import { TranslateLoaderMock } from 'src/app/shared/testing/translate-loader.mock';
import { MetadataValuesComponent } from 'src/app/item-page/field-components/metadata-values/metadata-values.component';
import { mockItemWithMetadataFieldsAndValue } from 'src/app/item-page/simple/field-components/specific-field/item-page-field.component.spec';
import { ItemPageTitleFieldComponent } from './item-page-title-field.component';

let comp: ItemPageTitleFieldComponent;
let fixture: ComponentFixture<ItemPageTitleFieldComponent>;

const mockField = 'crvs.identifier.houseFamilyKey';
const mockValue = 'test value';

describe('ItemPageTitleFieldComponent', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: TranslateLoaderMock,
        },
      }), ItemPageTitleFieldComponent, MetadataValuesComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).overrideComponent(ItemPageTitleFieldComponent, {
      set: { changeDetection: ChangeDetectionStrategy.Default },
    }).compileComponents();
  }));

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ItemPageTitleFieldComponent);
    comp = fixture.componentInstance;
    comp.item = mockItemWithMetadataFieldsAndValue([mockField], mockValue);
    fixture.detectChanges();
  }));

  it('should display display the correct metadata value', () => {
    expect(fixture.nativeElement.innerHTML).toContain(mockValue);
  });
});
