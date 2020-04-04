import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

interface KeyBoardItem {
  key: string;
  upperKey?: string;
  code: string;
  displayKey?: string;
  displayUpperKey?: string;
  hideUpperKey?: boolean;
  showUpperPop?: boolean;
}

@Component({
  selector: 'app-terminal-ime',
  templateUrl: './terminal-ime.component.html',
  styleUrls: ['./terminal-ime.component.scss']
})
export class TerminalImeComponent implements OnInit {

  @Input() target: HTMLInputElement;

  @Input() disabled = false;

  @Output() closed = new EventEmitter();

  keyboard: KeyBoardItem[][] = [
    [
      { key: '', displayKey: '⊗', code: 'Esc' },
      { key: '`', upperKey: '~', code: 'Backquote' },
      { key: '-', upperKey: '_', code: 'Minus' },
      { key: '=', upperKey: '+', code: 'Equal' },
      { key: '[', upperKey: '{', code: 'BracketLeft' },
      { key: ']', upperKey: '}', code: 'BracketRight' },
      { key: ',', upperKey: '<', code: 'Comma' },
      { key: '.', upperKey: '>', code: 'Period' },
      // { key: 'ArrowLeft', code: 'ArrowLeft', displayKey: '↤' },
      { key: 'ArrowUp', code: 'ArrowUp', displayKey: '↥' },
      { key: 'ArrowDown', code: 'ArrowDown', displayKey: '↧' },
      // { key: 'ArrowRight', code: 'ArrowRight', displayKey: '↦' },
      { key: 'Enter', code: 'Enter', displayKey: '⏎' }
    ],
    [
      ...Array.from('!@#$%^&*()', (c, idx) => this.numberKeyBoardItem(c, ((idx + 1) % 10).toString())),
      { key: 'Backspace', code: 'Backspace', displayKey: '⌫' },
    ],
    [
      ...Array.from('qwertyuiop', c => this.leterKeyBoardItem(c)),
      { key: '\\', upperKey: '|', code: 'Backslash' },
    ],
    [
      ...Array.from('asdfghjkl', c => this.leterKeyBoardItem(c)),
      { key: ';', upperKey: ':', code: 'Semicolon' },
      { key: '\'', upperKey: '"', code: 'Quote' },
    ],
    [
      ...Array.from('zxc', c => this.leterKeyBoardItem(c)),
      { key: ' ', code: 'Space' },
      ...Array.from('vbnm', c => this.leterKeyBoardItem(c)),
      { key: '/', upperKey: '?', code: 'Slash' },
    ],
  ];

  public pressedItem: KeyBoardItem;

  public longPressTime = 250;

  numberKeyBoardItem(upperKey, key: string) {
    return {
      key,
      upperKey,
      code: 'Digit' + key
    };
  }

  leterKeyBoardItem(key: string) {
    const upperKey = key.toUpperCase();
    return {
      key,
      upperKey,
      code: 'Key' + upperKey,
      hideUpperKey: true,
    };
  }

  constructor() { }

  ngOnInit() {
  }

  onTouchend(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  onMousecancle() {
    if (this.pressedItem) {
      this.pressedItem.showUpperPop = false;
    }
    this.pressedItem = null;
  }

  onMousedown(item: KeyBoardItem) {
    if (this.disabled || this.target == null || this.pressedItem === item) {
      return;
    }
    this.pressedItem = item;
    setTimeout(() => {
      if (this.pressedItem === item) {
        item.showUpperPop = true;
      }
    }, this.longPressTime);

    this.target.dispatchEvent(new KeyboardEvent('keydown', {
      key: item.key,
      code: item.code,
    }));
  }

  onMouseup(item: KeyBoardItem) {
    if (this.target == null || this.pressedItem !== item) {
      return;
    }
    const longPress = item.showUpperPop === true;
    item.showUpperPop = false;


    this.pressedItem = null;
    const key = longPress && item.upperKey || item.key;

    switch (item.code) {
      case 'Esc':
        this.closed.emit(null);
        return;
      case 'Enter':
        break;
      case 'ArrowLeft':
        break;
      case 'ArrowRight':
        break;
      case 'ArrowUp':
        break;
      case 'ArrowDown':
        break;
      case 'Backspace':
        this.target.value = this.target.value.slice(0, -1);
        break;
      default:
        this.target.value += key;
    }
    this.target.dispatchEvent(new KeyboardEvent('keyup', {
      key,
      code: item.code,
    }));
  }

}
