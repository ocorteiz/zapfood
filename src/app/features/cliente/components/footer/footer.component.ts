import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SlugService } from '../../../../core/resolver/slug.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent implements OnInit {

  dynamicParam: string = '';
  #slugService = inject(SlugService);

  ngOnInit() {
    this.dynamicParam = this.#slugService.getParam();
  }

}
