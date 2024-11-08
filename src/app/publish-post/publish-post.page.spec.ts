import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PublishPostPage } from './publish-post.page';

describe('PublishPostPage', () => {
  let component: PublishPostPage;
  let fixture: ComponentFixture<PublishPostPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PublishPostPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
