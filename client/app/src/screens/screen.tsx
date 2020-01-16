export interface Screen {
    id: string;
    title: string;
    generator: () => React.ComponentType<any>;
}

const ScreenIdentifiers = {
    TargetsScreen: 'TargetsScreen',
    ReportsScreen: 'ReportsScreen',
};

const Screens: { [key: string]: Screen } = {
    TargetsScreen: {
        id: ScreenIdentifiers.TargetsScreen,
        title: 'Targets',
        generator: () => require('../screens/TargetsList').default,
    },
    ReportsScreen: {
        id: ScreenIdentifiers.ReportsScreen,
        title: 'Reports',
        generator: () => require('../screens/ReportsList').default,
    },
};

export default Screens;
