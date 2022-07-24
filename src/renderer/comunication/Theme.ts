import { Communicator } from '../../shared/communicator/renderer/Communicator'
import ThemeContract from '../../shared/contracts/comunication/theme/ThemeContract'
import RendererCommunicator from '../../shared/communicator/renderer/RendererCommunicator'
import MainTheme from '../../main/communicator/MainTheme'

@RendererCommunicator('theme', MainTheme)
export default class Theme extends Communicator<ThemeContract> {

}
