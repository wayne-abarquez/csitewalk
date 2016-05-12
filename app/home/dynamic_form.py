from wtforms import Form, fields
from wtforms.fields import BooleanField, FileField
from collections import OrderedDict
from app import app
import logging
import itertools
import json

log = logging.getLogger(__name__)

FORM_SCHEMA_DIR = app.config['FORM_SCHEMA_DIR']


class FieldTypes:
    TEXT = "text"
    TEXTAREA = "textbox"
    SELECT = "select"
    NUMBER = "number"
    BOOL = "bool"
    CONTROLLED = "control"
    FILE = "file"
    IMAGE = "image"


class ControlledField(BooleanField):
    def __init__(self, children, label=None, validators=None, false_values=None, **kwargs):
        super(ControlledField, self).__init__(label, validators, false_values, **kwargs)
        self._children = children

    @property
    def children(self):
        return iter(self._children.iteritems())

    @property
    def children_fields(self):
        return self._children.values()

    @property
    def children_names(self):
        return self._children.keys()

    def set_child(self, name, field):
        self._children[name] = field

    def validate(self, form, extra_validators=tuple()):
        self.errors = []

        # Run validators on all children
        # if this BooleanField is active
        if self.data:
            for name, child in self.children:
                if not child.validate(form):
                    self.errors.append(child.errors)

        chain = itertools.chain(self.validators, extra_validators)
        self._run_validation_chain(form, chain)

        return len(self.errors) == 0


class CustomFileField(FileField):
    def __init__(self, is_required, can_screenshot, **kwargs):
        super(CustomFileField, self).__init__(**kwargs)
        self.is_required = is_required
        self.can_screenshot = can_screenshot


class DynamicForm(Form):
    def add_fields_as_attr(self):
        for name, field in self._fields.iteritems():
            setattr(self, name, field)

    @staticmethod
    def create_field_from_data(data):
        field_type = data['type'] if 'type' in data else FieldTypes.TEXT
        label = data['label'] if 'label' in data else ''
        params = data['values'] if 'values' in data else None
        return DynamicForm.create_field(field_type, label, params)

    @staticmethod
    def create_field(field_type, label, params=None):
        if field_type == FieldTypes.TEXT:
            return fields.StringField(label=label)
        elif field_type == FieldTypes.TEXTAREA:
            return fields.TextAreaField(label=label)
        elif field_type == FieldTypes.NUMBER:
            return fields.FloatField(label=label)
        elif field_type == FieldTypes.BOOL:
            return fields.BooleanField(label=label)
        elif field_type == FieldTypes.SELECT:
            choices = [(item, item) for item in params.split(';;')]
            return fields.SelectField(label=label, choices=choices)
        else:
            return None

    @classmethod
    def append_field(cls, name, field):
        setattr(cls, name, field)

    @classmethod
    def remove_field(cls, name):
        delattr(cls, name)


class SectionForm(DynamicForm):
    def __init__(self, formdata=None, obj=None, prefix='', data=None, meta=None, **kwargs):
        super(SectionForm, self).__init__(formdata, obj, prefix, data, meta, **kwargs)

        # Let's assign all ControlledField children to itself
        # once all the fields have been created and initialized.
        # Then we remove them from this form's list of fields.
        for name, field in self._fields.iteritems():
            if field.type == 'ControlledField':
                for child_name, child_field in self._fields.iteritems():
                    if child_name in field.children_names:
                        field.set_child(child_name, child_field)
                        del self._fields[child_name]

    @classmethod
    def from_schema(cls, schema, data=None):
        attr_names = []

        if 'fields' in schema:  # and type(data['fields']) is list:
            SectionForm.create_fields(schema['fields'], attr_names)

        # DEPRECATED: Use type='control' to create a controlledField
        if 'controlledFields' in schema:  # and type(data['controlledFields']) is list:
            SectionForm.create_controlled_fields(schema['controlledFields'], attr_names)

        # DEPRECATED: Use type='textarea' to create a textBox
        if 'textBoxes' in schema:  # and type(data['textBoxes']) is list:
            SectionForm.create_textboxes(schema['textBoxes'], attr_names)

        if data is None:
            form = SectionForm()
        else:
            form = SectionForm.from_json(data)
        form.name = schema['name'] if 'name' in schema else ''
        form.label = schema['label'] if 'label' in schema else ''

        # reset the class after creating an instance
        # with all the appended fields in it
        for name in attr_names:
            SectionForm.remove_field(name)

        # for some reason, instance attr gets deleted if class attr are deleted
        # so we reinitialize all the instance attr below
        form.add_fields_as_attr()

        return form

    @classmethod
    def create_fields(cls, data, attr_names):
        for entry in data:
            field_name = entry['name'] if 'name' in entry else ''
            field_type = entry['type'] if 'type' in entry else ''
            # for ControlledField, append all children to the form class
            if field_type == FieldTypes.CONTROLLED:
                SectionForm.create_controlled_field(entry, attr_names)
            elif field_type in [FieldTypes.FILE, FieldTypes.IMAGE]:
                field_label = entry['label'] if 'label' in entry else ''
                is_required = entry['required'] if 'required' in entry else False
                can_screenshot = entry['can_screenshot'] if 'can_screenshot' in entry else False
                field = CustomFileField(is_required, can_screenshot, label=field_label)
                SectionForm.append_field(field_name, field)
                attr_names.append(field_name)
            else:
                field = SectionForm.create_field_from_data(entry)
                SectionForm.append_field(field_name, field)
                attr_names.append(field_name)

    @classmethod
    def create_controlled_field(cls, entry, attr_names):
        parent_name = entry['name'] if 'name' in entry else ''
        parent_label = entry['label'] if 'label' in entry else ''
        children = entry['children'] if 'children' in entry else None
        if children is not None:
            children_fields = OrderedDict()
            for child in children:
                child_name = child['name'] if 'name' in child else ''
                child_field = SectionForm.create_field_from_data(child)
                SectionForm.append_field(child_name, child_field)
                children_fields[child_name] = child_field
                attr_names.append(child_name)
            parent_field = ControlledField(children_fields, label=parent_label)
            SectionForm.append_field(parent_name, parent_field)
            attr_names.append(parent_name)

    @classmethod
    def create_controlled_fields(cls, data, attr_names):
        for entry in data:
            SectionForm.create_controlled_field(entry, attr_names)

    @classmethod
    def create_textboxes(cls, fields, attr_names):
        for data in fields:
            fname = data['name'] if 'name' in data else ''
            label = data['label'] if 'label' in data else ''
            field = DynamicForm.create_field(FieldTypes.TEXTAREA, label)
            SectionForm.append_field(fname, field)
            attr_names.append(fname)


class SectionGroup:
    @staticmethod
    def load_from_file(name, data=None):
        filename = FORM_SCHEMA_DIR + name + '.json'
        with open(filename) as json_file:
            schema = json.load(json_file)
        return SectionGroup(schema, data)

    def __init__(self, json_schema, json_data=None):
        self.sections = []
        self.errors = {}
        if 'sections' in json_schema:  # and type(json_schema) is list:
            for schema in json_schema['sections']:
                form_name = schema['name'] if 'name' in schema else ''
                data = json_data[form_name] if json_data is not None and form_name in json_data else {}
                section = SectionForm.from_schema(schema, data)
                self.sections.append(section)

    def validate(self):
        error_count = 0
        self.errors = {}
        for section in self.sections:
            if not section.validate():
                self.errors[section.name] = section.errors
                error_count += len(section.errors)
        return error_count == 0


class FileForm(DynamicForm):
    pass


class FileGroup:
    def __init__(self):
        pass

