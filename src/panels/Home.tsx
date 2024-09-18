import { FC } from 'react';
import {
  Panel,
  PanelHeader,
  Header,
  Button,
  Group,
  Cell,
  Div,
  Avatar,
  NavIdProps,
} from '@vkontakte/vkui';
import bridge, { UserInfo } from '@vkontakte/vk-bridge';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

export interface HomeProps extends NavIdProps {
  fetchedUser?: UserInfo;
}

export const Home: FC<HomeProps> = ({ id, fetchedUser }) => {
  const { photo_200, city, first_name, last_name } = { ...fetchedUser };
  const routeNavigator = useRouteNavigator();

  const getRandomImage = async () => {
    const response = await fetch('https://dog.ceo/api/breeds/image/random');
    const data = await response.json();
    return data.message;
  };

  const Story = async () => {
    const imageUrl = await getRandomImage();

    bridge.send('VKWebAppShowStoryBox', {
      background_type: 'image',
      url: imageUrl,
      attachment: {
        text: `more`,
        type: 'photo',
        owner_id: 743784474,
        id: 12345678
      }
    })
    .then((data) => {
      if (data.result) {
        console.log(data); // Редактор историй открыт
      }
    })
    .catch((error) => {
      console.log(error); // Ошибка
    });
  };

  return (
    <Panel id={id}>
      <PanelHeader>Главная</PanelHeader>
      {fetchedUser && (
        <Group header={<Header mode="secondary">User Data Fetched with VK Bridge</Header>}>
          <Cell before={photo_200 && <Avatar src={photo_200} />} subtitle={city?.title}>
            {`${first_name} ${last_name}`}
          </Cell>
        </Group>
      )}

      <Group header={<Header mode="secondary">Navigation Example</Header>}>
        <Div>
          <Button stretched size="l" mode="secondary" onClick={() => routeNavigator.push('persik')}>
            Покажите Персика, пожалуйста!
          </Button>
        </Div>
      </Group>

      <Group header={<Header mode="secondary">Редактор историй ВКонтакте</Header>}>
        <Div>
          <Button stretched size="l" mode="secondary" onClick={Story}>
            Открыть редактор историй с шобакой
          </Button>
        </Div>
      </Group>
    </Panel>
  );
};

export default Home;