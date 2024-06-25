<?php

namespace App\Http\Controllers;

use App\Http\Resources\RoleCollection;
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
            'roles' => new RoleCollection($roles),
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required',
        ]);

        DB::beginTransaction();
        try {
            $role = Role::create([
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

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
        ]);

        DB::beginTransaction();
        try {
            $role = Role::find($id);

            $role->update([
                'name' => $request->name
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

    public function delete(string $id)
    {
        DB::beginTransaction();
        try {
            $role = Role::find($id);
            $role->delete();

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
