### HTML

The Module component has changed significantly! Here's one example of how the component can be composed.

```html
<div class="bx--module bx--module--double">
  <div class="bx--module__inner">
    <div class="bx--module__header">
      <h1 class="bx--module__title">Example header</h1>
    </div>
    <div class="bx--module__content">
      <p class="bx--module__text">
        Example content
      </p>
    </div>
  </div>
</div>
```

For more examples see the `module.html` file.

### SCSS

The `_module.scss` file is now located at `src/components/modules/_module.scss`. You'll need to update any `@import` statements for this file to reflect this change.

**New**:

```scss
@import 'path_to_node_modules/carbon-components/src/components/module/module';
```

**Old**:

```scss
@import 'path_to_node_modules/@console/bluemix-components/src/components/module/module';
```

| Old Class             | New Class                         | Note    |
| --------------------- | --------------------------------- | ------- |
| bx--module--full      |                                   | Removed |
| bx--module--half      |                                   | Removed |
| bx--module--two-third |                                   | Removed |
| bx--module--one-third |                                   | Removed |
| bx--module\_\_body    |                                   | Removed |
| bx--module\_\_footer  |                                   | Removed |
|                       | bx--module--single                | Added   |
|                       | bx--module--double                | Added   |
|                       | bx--module\_\_content--scrollable | Added   |
|                       | bx--module\_\_inner               | Added   |
|                       | bx--module\_\_title               | Added   |
|                       | bx--module\_\_text                | Added   |
|                       | bx--module\_\_content             | Added   |
|                       | bx--module\_\_content--centered   | Added   |
