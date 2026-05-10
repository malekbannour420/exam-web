<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NoteController extends Controller
{
    public function index()
    {
        return Note::where('user_id', Auth::id())->latest()->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'content' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
        ]);

        return Note::create([
            'user_id' => Auth::id(),
            ...$validated,
        ]);
    }

    public function update(Request $request, int $id)
    {
        $note = Note::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $validated = $request->validate([
            'title' => 'required|string|max:100',
            'content' => 'nullable|string',
            'priority' => 'required|in:low,medium,high',
        ]);

        $note->update($validated);

        return $note;
    }

    public function destroy(int $id)
    {
        $note = Note::where('id', $id)
            ->where('user_id', Auth::id())
            ->firstOrFail();

        $note->delete();

        return ['message' => 'deleted'];
    }
}