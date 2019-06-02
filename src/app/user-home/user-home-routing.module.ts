import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RecordPage } from './record/record.page';
import { UserHomePage } from './user-home.page';
import { RecordPageModule } from './record/record.module';

const routes: Routes = [
    {
        path: '',
        component: UserHomePage,
        children: [
            {
                path: 'record',
                loadChildren: 'src/app/user-home/record/record.module#RecordPageModule'
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserHomeRoutingModule {}