<?php

namespace App\Http\Requests\Admin;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $pageId = $this->route('page')?->id;

        return [
            'title' => ['required', 'string', 'max:255'],
            'slug' => ['nullable', 'string', 'max:255', 'alpha_dash', Rule::unique('pages', 'slug')->ignore($pageId)],
            'content' => ['nullable', 'string'],
            'sections' => ['nullable', 'array'],
            'sections.*.label' => ['nullable', 'string', 'max:100'],
            'sections.*.title' => ['required', 'string', 'max:200'],
            'sections.*.body' => ['nullable', 'string', 'max:5000'],
            'sections.*.tags' => ['nullable', 'array'],
            'sections.*.tags.*' => ['string', 'max:50'],
            'meta_description' => ['nullable', 'string', 'max:255'],
            'is_published' => ['required', 'boolean'],
        ];
    }
}
