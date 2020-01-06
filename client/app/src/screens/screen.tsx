export interface Screen {
    id: string;
    title: string;
    generator: () => any;
}

const Screens: { [key: string]: Screen } = {
    TargetsScreen: {
        id: 'TargetsScreen',
        title: 'Targets',
        generator: () => require('../screens/TargetList').default,
    },
};

export default Screens;
