import {AfterViewInit, Component, OnInit, Renderer2} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import 'rxjs/add/operator/filter';
import {RoutePartsService} from './shared/services/route-parts.service';
import {ThemeService} from './shared/services/theme.service';

import {filter} from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  appTitle = 'Freedom Pass';
  pageTitle = '';

  constructor(public title: Title,
              private router: Router,
              private activeRoute: ActivatedRoute,
              private routePartsService: RoutePartsService,
              private themeService: ThemeService,
              private renderer: Renderer2) {
  }

  ngOnInit() {
    this.changePageTitle();
  }

  ngAfterViewInit() {
    this.themeService.applyMatTheme(this.renderer);
  }

  changePageTitle() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((routeChange) => {
      const routeParts = this.routePartsService.generateRouteParts(this.activeRoute.snapshot);
      if (!routeParts.length) {
        return this.title.setTitle(this.appTitle);
      }
      // Extract title from parts;
      this.pageTitle = routeParts
        .reverse()
        .map((part) => part.title)
        .reduce((partA, partI) => {
          return `${partA} > ${partI}`;
        });
      this.pageTitle += ` | ${this.appTitle}`;
      this.title.setTitle(this.pageTitle);
    });
  }

}
