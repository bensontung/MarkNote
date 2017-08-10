import {GuardService} from '../service/guard.service';

export const AppRouter = [
    {path: '', redirectTo: '/note', pathMatch: 'full'},
    {path: 'note', loadChildren: './template/note_module/note.module#NoteModule', canActivate: [ GuardService ]},
    {path: 'laboratory', loadChildren: './template/laboratory_module/laboratory.module#LaboratoryModule', canActivate: [ GuardService ]}
];
