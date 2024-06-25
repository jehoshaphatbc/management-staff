<?php

namespace App\Http\Controllers;

use App\Http\Resources\RoleCollection;
use App\Http\Resources\UnitCollection;
use App\Http\Resources\UserCollection;
use App\Models\Unit;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request) {
        $users = User::whereNotNull('id');
        $units = Unit::get();
        $roles = Role::get();

        $formattedRoles = $roles->map(function($role) {
            return [
                'value' => $role->id,
                'label' => $role->name
            ];
        });

        $formattedUnits = $units->map(function($unit) {
            return [
                'value' => $unit->id,
                'label' => $unit->name
            ];
        });

        if($request->search) {
            $search = $request->search;
            $users = $users->where(function ($query) use ($search) {
                $query->where('username', 'LIKE', '%'.$search.'%')
                ->orWhere('name', 'LIKE', '%'.$search.'%');
            });
        }

        if($request->sortBy && $request->sortDirection) {
            $users = $users->orderBy($request->sortBy, $request->sortDirection);
        }

        $users = $users->paginate($request->paginate ?? 10);

        return Inertia::render('User/Index', [
            'users' => new UserCollection($users),
            'units' => $formattedUnits,
            'roles' => $formattedRoles,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request) {

        $request->validate([
            'name' => 'required',
            'username' => 'required|unique:users,username',
            'password' => 'required',
            'unit' => 'required',
            'roles' => 'required',
        ]);

        DB::beginTransaction();
        try {
            $unit = null;

            if(isset($request->unit['__isNew__'])) {
                $newUnit = Unit::create([
                    'name' => $request->unit['label'],
                ]);

                $unit = $newUnit->id;
            } else {
                $unit = $request->unit['value'];
            }

            $user = User::create($this->fillData($request, $unit, Hash::make($request->password)));

            $rolesToAssign = [];

            foreach ($request->roles as $role) {
                if (isset($role['__isNew__'])) {
                    $newRole = Role::create([
                        'name' => $role['label'],
                    ]);

                    $rolesToAssign[] = $newRole->name;
                } else {
                    $rolesToAssign[] = $role['label'];
                }
            }

            $user->syncRoles($rolesToAssign);

            DB::commit();

        } catch(\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
            'username' => ['required', Rule::unique(User::class)->ignore($request->id)],
            'unit' => 'required',
            'roles' => 'required',
        ]);

        DB::beginTransaction();
        try {
            $user = User::find($id);

            $unit = null;

            if(isset($request->unit['__isNew__'])) {
                $newUnit = Unit::create([
                    'name' => $request->unit['label'],
                ]);

                $unit = $newUnit->id;
            } else {
                $unit = $request->unit['value'];
            }

            $password = $user?->password;

            if ($request->password) {
                $password = Hash::make($request->password);
            }

            $user->update($this->fillData($request, $unit, $password));

            $rolesToAssign = [];

            foreach ($request->roles as $role) {
                if (isset($role['__isNew__'])) {
                    $newRole = Role::create([
                        'name' => $role['label'],
                    ]);

                    $rolesToAssign[] = $newRole->name;
                } else {
                    $rolesToAssign[] = $role['label'];
                }
            }

            $user->syncRoles($rolesToAssign);

            DB::commit();

        } catch(\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete(string $id)
    {
        DB::beginTransaction();
        try {
            $user = User::find($id);
            $user->delete();

            DB::commit();

        } catch(\Exception $e) {
            DB::rollBack();

            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ]);
        }
    }

    /**
     * fillData
     *
     * @param  mixed $data
     * @return void
     */
    public function fillData($data, $unit, $password)
    {
        return [
            'id' => $data->id,
            'name' => $data->name,
            'unit_id' => $unit,
            'username' => $data->username,
            'password' => $password,
            'email_verified_at' => now(),
            'join_date' => now(),
        ];
    }
}
