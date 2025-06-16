import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { IHtmlUtils, N2HtmlDecorator, addN2Class, removeN2Class } from '../../../core/gui2/N2HtmlDecorator'; // Replace with your actual module path

describe('IHtmlUtils', () => {
    it('should initialize N2HtmlDecorator with default values', () => {
        const decorator: N2HtmlDecorator = {};
        const initializedDecorator = IHtmlUtils.init(decorator);
        expect(initializedDecorator.tag).to.equal('div');
        expect(initializedDecorator.classes).to.deep.equal([]);
        expect(initializedDecorator.style).to.deep.equal({});
        expect(initializedDecorator.otherAttr).to.deep.equal({});
    });

    it('should generate class attribute string', () => {
        const decorator: N2HtmlDecorator = { classes: ['class1', 'class2'] };
        const classStr = IHtmlUtils.class(decorator);
        expect(classStr).to.equal('class="class1 class2"');
    });

    it('should generate style attribute string', () => {
        const decorator: N2HtmlDecorator = { style: { color: 'red' } };
        const styleStr = IHtmlUtils.style(decorator);
        expect(styleStr).to.equal('style="color:red;"'); // Assuming cssStyleToString function converts to this format
    });

    it('should generate other attributes string', () => {
        const decorator: N2HtmlDecorator = { otherAttr: { id: 'test', disabled: 'true' } };
        const otherAttrStr = IHtmlUtils.otherAttr(decorator);
        expect(otherAttrStr).to.equal('id="test" disabled="true"');
    });

    it('should generate all attributes string', () => {
        const decorator: N2HtmlDecorator = {
            classes: ['class1'],
            style: { color: 'red' },
            otherAttr: { id: 'test' }
        };
        const allStr = IHtmlUtils.all(decorator);
        expect(allStr).to.equal('class="class1" style="color:red;" id="test"');
    });
});

describe('addN2Class', () => {
    it('should add a single class to N2HtmlDecorator', () => {
        const decorator: N2HtmlDecorator = { classes: ['existing'] };
        const updatedDecorator = addN2Class(decorator, 'newClass');
        expect(updatedDecorator.classes).to.deep.equal(['existing', 'newClass']);
    });

    it('should add multiple classes to N2HtmlDecorator', () => {
        const decorator: N2HtmlDecorator = { classes: ['existing'] };
        const updatedDecorator = addN2Class(decorator, 'newClass1', 'newClass2');
        expect(updatedDecorator.classes).to.deep.equal(['existing', 'newClass1', 'newClass2']);
    });

    it('should not add duplicate classes', () => {
        const decorator: N2HtmlDecorator = { classes: ['existing'] };
        const updatedDecorator = addN2Class(decorator, 'existing');
        expect(updatedDecorator.classes).to.deep.equal(['existing']);
    });
});

describe('removeN2Class', () => {
    it('should remove a single class from N2HtmlDecorator', () => {
        const decorator: N2HtmlDecorator = { classes: ['existing', 'toBeRemoved'] };
        const updatedDecorator = removeN2Class(decorator, 'toBeRemoved');
        expect(updatedDecorator.classes).to.deep.equal(['existing']);
    });

    it('should remove multiple classes from N2HtmlDecorator', () => {
        const decorator: N2HtmlDecorator = { classes: ['existing', 'toBeRemoved1', 'toBeRemoved2'] };
        const updatedDecorator = removeN2Class(decorator, 'toBeRemoved1', 'toBeRemoved2');
        expect(updatedDecorator.classes).to.deep.equal(['existing']);
    });

    it('should not remove non-existing classes', () => {
        const decorator: N2HtmlDecorator = { classes: ['existing'] };
        const updatedDecorator = removeN2Class(decorator, 'nonExisting');
        expect(updatedDecorator.classes).to.deep.equal(['existing']);
    });
});