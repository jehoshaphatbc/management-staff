<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $user = User::find($this->id);
        $roles = $user->roles;

        $formattedRoles = $roles->map(function($role) {
            return [
                'label' => $role->name,
                'value' => $role->id
            ];
        });

        return [
            'id' => $this->id,
            'name' => $this->name,
            'unit_id' => $this->unit_id ?? null,
            'join_date' => $this->join_date,
            'username' => $this->username,
            'password' => $this->password,
            'getRoles' => $formattedRoles ?? []
        ];
    }
}
