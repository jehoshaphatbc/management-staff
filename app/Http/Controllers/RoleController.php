<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserCollection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index(Request $request) {
        $roles = Role::whereNotNull('id');

        if($request->search) {
            $search = $request->search;
            $roles = $roles->where(function ($query) use ($search) {
                $query->where('username', 'LIKE', '%'.$search.'%')
                ->orWhere('name', 'LIKE', '%'.$search.'%');
            });
        }

        if($request->sortBy && $request->sortDirection) {
            $roles = $roles->orderBy($request->sortBy, $request->sortDirection);
        }

        $roles = $roles->paginate($request->paginate ?? 10);

        return Inertia::render('Role/Index', [
            'roles' => new UserCollection($roles),
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required',
        ]);

        DB::beginTransaction();
        try {
            $unit = Role::create([
                'name' => $request->name,
            ]);

            DB::commit();

        } catch(\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ]);
        }
    }
}
