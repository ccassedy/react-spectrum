import Button from '../../src/Button';
import Dropdown from '../../src/Dropdown';
import assert from 'assert';
import React from 'react';
import Select, {SelectMenu} from '../../src/Select';
import {shallow} from 'enzyme';
import sinon from 'sinon';

const testOptions = [
  {label: 'Chocolate', value: 'chocolate'},
  {label: 'Vanilla', value: 'vanilla'},
  {label: 'Strawberry', value: 'strawberry'},
  {label: 'Caramel', value: 'caramel'},
  {label: 'Cookies and Cream', value: 'cookiescream', disabled: true},
  {label: 'Coconut', value: 'coco'},
  {label: 'Peppermint', value: 'peppermint'},
  {label: 'Some crazy long value that should be cut off', value: 'logVal'}
];

describe('Select', () => {
  it('renders a dropdown', () => {
    const tree = shallow(<Select />);
    const dropdown = tree.find(Dropdown);
    assert.equal(dropdown.prop('className'), 'coral3-Select');
    assert.equal(tree.state('value'), null);
  });

  it('supports additional classNames', () => {
    const tree = shallow(<Select className="myClass" />);
    const select = tree.find(Dropdown);

    assert.equal(select.hasClass('myClass'), true);
    // Check that coral3-Select is not overwritten by the provided class.
    assert.equal(select.hasClass('coral3-Select'), true);
  });

  it('renders options', () => {
    const tree = shallow(<Select options={testOptions} />);
    assert.equal(tree.find('.coral3-Select-label').text(), 'Chocolate');
    assert.deepEqual(tree.find(SelectMenu).prop('options'), testOptions);
    assert.equal(tree.find(SelectMenu).prop('value'), 'chocolate');
  });

  it('renders options with multiple select', () => {
    const tree = shallow(<Select options={testOptions} multiple />);
    assert.equal(tree.find('.coral3-Select-label').text(), 'Select an option');
    assert.deepEqual(tree.find(SelectMenu).prop('options'), testOptions);
    assert.deepEqual(tree.find(SelectMenu).prop('value'), []);
  });

  it('should set an initial value', () => {
    const tree = shallow(<Select options={testOptions} value="vanilla" />);
    assert.equal(tree.find('.coral3-Select-label').text(), 'Vanilla');
    assert.deepEqual(tree.find(SelectMenu).prop('options'), testOptions);
    assert.equal(tree.find(SelectMenu).prop('value'), 'vanilla');
  });

  it('should set an initial value with multiple select', () => {
    const tree = shallow(<Select options={testOptions} value={['vanilla', 'caramel']} multiple />);
    assert.equal(tree.find('.coral3-Select-label').text(), 'Select an option');
    assert.deepEqual(tree.find(SelectMenu).prop('options'), testOptions);
    assert.deepEqual(tree.find(SelectMenu).prop('value'), ['vanilla', 'caramel']);
  });

  it('should set a default value', () => {
    const tree = shallow(<Select options={testOptions} defaultValue="vanilla" />);
    assert.equal(tree.find('.coral3-Select-label').text(), 'Vanilla');
    assert.deepEqual(tree.find(SelectMenu).prop('options'), testOptions);
    assert.equal(tree.find(SelectMenu).prop('value'), 'vanilla');
  });

  it('should update value if passed in', () => {
    const tree = shallow(<Select options={testOptions} value="vanilla" />);
    assert.equal(tree.find('.coral3-Select-label').text(), 'Vanilla');
    assert.deepEqual(tree.find(SelectMenu).prop('options'), testOptions);
    assert.equal(tree.find(SelectMenu).prop('value'), 'vanilla');

    tree.setProps({value: 'chocolate'});

    assert.equal(tree.find('.coral3-Select-label').text(), 'Chocolate');
    assert.deepEqual(tree.find(SelectMenu).prop('options'), testOptions);
    assert.equal(tree.find(SelectMenu).prop('value'), 'chocolate');
  });

  it('should handle selection', () => {
    const onChange = sinon.spy();
    const tree = shallow(<Select options={testOptions} onChange={onChange} />);
    assert.equal(tree.state('value'), 'chocolate');

    tree.find(Dropdown).simulate('select', 'vanilla');

    assert.equal(tree.state('value'), 'vanilla');
    assert(onChange.called);
  });

  it('should not update state if value prop is passed', () => {
    const onChange = sinon.spy();
    const tree = shallow(<Select options={testOptions} value="vanilla" onChange={onChange} />);
    assert.equal(tree.state('value'), 'vanilla');

    tree.find(Dropdown).simulate('select', 'chocolate');

    assert.equal(tree.state('value'), 'vanilla');
    assert(onChange.called);
  });

  it('should trigger the menu on key press', () => {
    const tree = shallow(<Select options={testOptions} />);

    for (let key of ['Enter', 'ArrowDown', 'Space']) {
      const spy = sinon.spy();
      tree.instance().button = {onClick: spy};

      tree.find(Button).simulate('keyDown', {key, preventDefault: function () {}});
      assert(spy.called);
    }
  });
});