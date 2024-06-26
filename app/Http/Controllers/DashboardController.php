<?php

namespace App\Http\Controllers;

use App\Models\Login;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class DashboardController extends Controller
{
    public function index()
    {
        $users = User::count();
        $login = Login::count();
        $units = Unit::count();
        $roles = Role::count();

        $topUsers = Login::select('logins.user_id', 'users.name', DB::raw('count(*) as total_logins'))
                        ->join('users', 'logins.user_id', '=', 'users.id')
                        ->groupBy('user_id', 'users.name', 'users.username')
                        ->having('total_logins', '>', 25)
                        ->orderByDesc('total_logins')
                        ->take(10)
                        ->get();

        return Inertia::render('Dashboard', [
            'countUsers' => $users,
            'countLogin' => $login,
            'countUnits' => $units,
            'countRoles' => $roles,
            'topUsers' => $topUsers
        ]);
    }
}
