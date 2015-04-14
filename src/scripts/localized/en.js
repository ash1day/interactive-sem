'use strict';
exports.isemDialogAddLatentVariable = {
    title: function () { return 'Add Latent Variable'; },
    inputLabel: function () { return 'Name'; },
    buttonCancel: function () { return 'Cancel'; },
    buttonPrimary: function () { return 'Add'; }
};
exports.isemDialogAddRelation = {
    title: function () { return 'Add Relation'; },
    inputLabelX: function () { return 'Variable X'; },
    inputLabelY: function () { return 'Variable Y'; },
    directionXtoY: function () { return '↑'; },
    directionMutual: function () { return '↑↓'; },
    directionYtoX: function () { return '↓'; },
    buttonCancel: function () { return 'Cancel'; },
    buttonClose: function () { return 'Close'; },
    buttonPrimary: function () { return 'Add'; }
};
exports.isemDialogImportFile = {
    title: function () { return 'Import File'; },
    encodingUTF8: function () { return 'UTF-8'; },
    encodingSJIS: function () { return 'Shift_JIS'; },
    fileInput: function () { return 'CSV'; },
    downloadSample: function () { return 'Download a sample'; },
    buttonCancel: function () { return 'Cancel'; },
    buttonPrimary: function () { return 'Import'; }
};
exports.isemDialogManageRelation = {
    title: function () { return 'Manage Relation'; },
    buttonCancel: function () { return 'Cancel'; },
    buttonPrimary: function () { return 'Remove Checked'; }
};
exports.isemDialogRenameVariable = {
    title: function () { return 'Rename Variable'; },
    inputLabel: function () { return 'Name'; },
    buttonCancel: function () { return 'Cancel'; },
    buttonPrimary: function () { return 'Rename'; }
};
exports.isemGuiNewLatentVariable = {
    defaultVariableName: function () { return 'Untitled'; },
    label: function () { return 'New Latent Variable'; }
};
exports.isemHeader = {
    title: function () { return 'Interactive Structural Equation Modeling'; }
};
exports.isemNetworkDiagramToolGroup = {
    openAddVariable: function () { return 'Add Latent Variable…'; },
    openImportFile: function () { return 'Import File…'; },
    updateDiagram: function () { return 'Update'; }
};
