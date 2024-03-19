<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\V1\TodoResource;
use App\Http\Resources\V1\TodoCollection;
use App\Models\Todo;
use Illuminate\Http\Request;
class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return new TodoCollection(Todo::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $todo = Todo::create([
            'title' => $request->title,
            'text' => $request->text,
            'completed' => $request->completed
        ]);
        if ($todo) {
            return response()->json(['success' => true, 'todo' => $todo]);
        }else {
            return response()->json(['success' => false, 'todo' => $todo]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Todo $todo)
    {
        return new TodoResource($todo);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Todo $todo)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Todo $todo)
    {
        $result = $todo->delete();
        if ($result) {
            return response()->json(['success' => true, 'todo' => $todo]);
        }else {
            return response()->json(['success' => false, 'todo' => $todo]);
        }
    }

    public function markAllIncomplete(Todo $todo)
    {
        $todo->update(['completed' => false]);
        return response()->json(['message' => 'All items marked incomplete successfully!'], 200);
    }

    public function markAllComplete(Todo $todo)
    {
        $todo->update(['completed' => true]);
        return response()->json(['message' => 'All items marked complete successfully!'], 200);
    }

    public function removeAllItems(Todo $todo)
    {
        $todo->delete();
        return response()->json(['message' => 'All items removed successfully!'], 200);
    }
}
