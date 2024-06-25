<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\ResourceCollection;

class UnitCollection extends ResourceCollection
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'data' => UnitResource::collection($this->collection),
            'filtered' => [
                'page' => $request->page ?? 1,
                'paginate' => $request->paginate ?? 10,
                'search' => $request->search ?? '',
                'sortBy' => $request->sortBy ?? '',
                'type' => $request->type ?? '',
                'sortDirection' => $request->sortDirection ?? '',
            ],
            'attributes' => [
                'total' => $this->total(),
                'count' => $this->count(),
                'per_page' => $this->perPage(),
                'current_page' => $this->currentPage(),
                'total_pages' => $this->lastPage(),
            ]
        ];
    }
}
