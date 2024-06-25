<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserCollection;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function index(Request $request) {
        $units = Unit::whereNotNull('id');

        if($request->search) {
            $search = $request->search;
            $units = $units->where(function ($query) use ($search) {
                $query->where('username', 'LIKE', '%'.$search.'%')
                ->orWhere('name', 'LIKE', '%'.$search.'%');
            });
        }

        if($request->sortBy && $request->sortDirection) {
            $units = $units->orderBy($request->sortBy, $request->sortDirection);
        }

        $units = $units->paginate($request->paginate ?? 10);

        return Inertia::render('Unit/Index', [
            'units' => new UserCollection($units),
        ]);
    }

    public function store(Request $request) {
        $request->validate([
            'name' => 'required',
        ]);

        DB::beginTransaction();
        try {
            $unit = Unit::create([
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
