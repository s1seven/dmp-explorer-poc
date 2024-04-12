import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  template: `<div class="flex flex-col bg-primary-50/10 h-screen">
    <app-navbar></app-navbar>
    <div class="flex-1 flex flex-col overflow-auto">
      <div class="flex-1 flex flex-col">
        <div class="container mx-auto py-16 overflow-hidden flex-1">
          <router-outlet></router-outlet>
        </div>
        <!-- footer -->
        <div class="border-t border-gray-200">
          <div class="container flex py-8 text-gray-800 justify-between">
            <a class="flex gap-2 items-center" href="/">
              <svg
                class="w-[28px] h-[28px]"
                width="100%"
                height="100%"
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M0 32C0 20.799 0 15.1984 2.17987 10.9202C4.09734 7.15695 7.15695 4.09734 10.9202 2.17987C15.1984 0 20.799 0 32 0C43.201 0 48.8016 0 53.0798 2.17987C56.8431 4.09734 59.9027 7.15695 61.8201 10.9202C64 15.1984 64 20.799 64 32C64 43.201 64 48.8016 61.8201 53.0798C59.9027 56.8431 56.8431 59.9027 53.0798 61.8201C48.8016 64 43.201 64 32 64C20.799 64 15.1984 64 10.9202 61.8201C7.15695 59.9027 4.09734 56.8431 2.17987 53.0798C0 48.8016 0 43.201 0 32ZM22 56C29.732 56 36 49.732 36 42V36H42C49.732 36 56 29.732 56 22C56 14.268 49.732 8 42 8C34.268 8 28 14.268 28 22L28 28H22C14.268 28 8 34.268 8 42C8 49.732 14.268 56 22 56ZM36 33H42C48.0751 33 53 28.0751 53 22C53 15.9249 48.0751 11 42 11C35.9249 11 31 15.9249 31 22L31 28L33 28V22C33 17.0294 37.0294 13 42 13C46.9706 13 51 17.0294 51 22C51 26.9706 46.9706 31 42 31H36V33ZM36 28L39 28H42C45.3137 28 48 25.3137 48 22C48 18.6863 45.3137 16 42 16C38.6863 16 36 18.6863 36 22V25V28ZM22 36C18.6863 36 16 38.6863 16 42C16 45.3137 18.6863 48 22 48C25.3137 48 28 45.3137 28 42V36H22Z"
                  fill="currentColor"
                ></path>
                <path
                  d="M31 28H33V44C33 44.5523 32.5523 45 32 45V45C31.4477 45 31 44.5523 31 44V28Z"
                  fill="currentColor"
                ></path>
              </svg>
              <span>DMP</span>
              <span class="font-thin -ml-1">Explorer</span>
            </a>
            <div class="flex flex-col text-xs items-center text-center">
              <span>Powered by S1SEVEN &copy;2019-2024</span>

              <span
                >The DMP Explorer provides insights into<br />Digital Material
                Passports.</span
              >
              <span
                >Data schemas maintained by
                <a class="underline" href="https://materialidentity.org"
                  >Material Identity</a
                >.</span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, NavbarComponent],
})
export class ShellComponent {}
