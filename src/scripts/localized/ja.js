'use strict';
exports.isemDialogAddLatentVariable = {
    title: function () { return '潜在変数を追加'; },
    inputLabel: function () { return '変数名'; },
    buttonCancel: function () { return 'キャンセル'; },
    buttonPrimary: function () { return '追加'; }
};
exports.isemDialogAddRelation = {
    title: function () { return 'パスを追加'; },
    inputLabelX: function () { return '変数X'; },
    inputLabelY: function () { return '変数Y'; },
    directionXtoY: function () { return '↑'; },
    directionMutual: function () { return '↑↓'; },
    directionYtoX: function () { return '↓'; },
    buttonCancel: function () { return 'キャンセル'; },
    buttonClose: function () { return '閉じる'; },
    buttonPrimary: function () { return '追加'; }
};
exports.isemDialogImportFile = {
    title: function () { return 'ファイル読み込み'; },
    encodingUTF8: function () { return 'UTF-8'; },
    encodingSJIS: function () { return 'Shift_JIS'; },
    fileInput: function () { return 'CSVファイル'; },
    downloadSample: function () { return 'サンプルファイル'; },
    buttonCancel: function () { return 'キャンセル'; },
    buttonPrimary: function () { return 'OK'; }
};
exports.isemDialogManageRelation = {
    title: function () { return 'パスの管理'; },
    buttonCancel: function () { return 'キャンセル'; },
    buttonPrimary: function () { return 'チェックしたパスを削除'; }
};
exports.isemDialogRenameVariable = {
    title: function () { return '変数名を変更'; },
    inputLabel: function () { return '変数名'; },
    buttonCancel: function () { return 'キャンセル'; },
    buttonPrimary: function () { return 'OK'; }
};
exports.isemGuiNewLatentVariable = {
    defaultVariableName: function () { return '名称未設定'; },
    label: function () { return '新規潜在変数'; }
};
exports.isemHeader = {
    title: function () { return '共分散構造分析'; }
};
exports.isemNetworkDiagramToolGroup = {
    openAddVariable: function () { return '潜在変数を追加…'; },
    openImportFile: function () { return '読み込み…'; },
    updateDiagram: function () { return '更新'; }
};
