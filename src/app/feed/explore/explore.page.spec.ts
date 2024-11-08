import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import { ExplorePage } from './explore.page';

describe('ExplorePage', () => {
  let component: ExplorePage;
  let fixture: ComponentFixture<ExplorePage>;

  beforeEach(waitForAsync(() => {
    fixture = TestBed.createComponent(ExplorePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
