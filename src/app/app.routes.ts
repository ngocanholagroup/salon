import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Home } from './home/home';
import { Payload } from './page/payload/payload';

export const routes: Routes = [
    { path: '', component: Home },
    { path: 'payload', component: Payload }
];


@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }