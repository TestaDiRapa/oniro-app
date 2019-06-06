import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';
import { SettingsPage } from '../settings/settings.page';
import { LoginPage } from '../login/login.page';

const routes: Routes = [
    {
        path: '',
        component: HomePage
    },
    {
        path: 'home',
        component: HomePage,
        children: [
            {
                path: 'settings',
                component: SettingsPage,
                children: [
                    {
                        path:":id",
                        component: LoginPage
                    }
                ]
            },
        ]
    },  { path: 'diary', loadChildren: './diary/diary.module#DiaryPageModule' },
  { path: 'info', loadChildren: './info/info.module#InfoPageModule' },
  { path: 'contacts', loadChildren: './contacts/contacts.module#ContactsPageModule' },
  { path: 'gmaps', loadChildren: './gmaps/gmaps.module#GmapsPageModule' }

];

@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRouting {}
