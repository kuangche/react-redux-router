/**
 * Created by anchao on 2016/6/30.
 */
import { React, PropTypes, PureComponent } from 'framework/Util'
import enhanceWithClickOutside from 'react-click-outside'
import classNames from 'classnames/bind'
import dialog from 'dialog'

class TodoSingle extends PureComponent {
    constructor(props) {
        super(props)
        const { data } = props

        this.state = {
            data,
            hideDelIcon: true,
            hideEditInput: true
        }
    }

    todoRemove = () => {
        const { data } = this.state
        const { removeTodo } = this.props
        removeTodo({ params: { id: data.id } })
    }
    
    finishNameEdit = (e) => {
        if (e.which === 13) {
            this.toggleHideEditInput(true)
            e.preventDefault()
        }
    }
    
    todoUpdate(e, todoKey){
        const text = e.currentTarget.value
        const { onUpdateTodo } = this.props
        this.setState((prevState) => {
            const { data } = prevState
            const { id, completed } = data
            switch (todoKey) {
            case 'completed':
                onUpdateTodo({ data: { id, completed: !completed } })
                    .then((res) => {
                        if (res.statusCode !== 200) {
                            dialog.alert({
                                infoType: 'error',
                                content: <div>{res.message}</div>
                            })
                        }
                    })
                return { data: { ...prevState.data, completed: !completed } }
            case 'text':
                return { data: { ...prevState.data, text } }
            default:
                return { data }
            }
        })
    }
    
    handleClickOutside() {
        const { data, hideEditInput } = this.state
        const { onUpdateTodo } = this.props
        this.toggleHideEditInput(true)
        
        if (!hideEditInput) {
            onUpdateTodo({ data: { id: data.id, text: data.text } })
        }
    }
    
    toggleHideEditInput(hideEditInput) {
        this.setState({ hideEditInput })
    }
    
    toggleHideDelIcon(hideDelIcon) {
        this.setState({ hideDelIcon })
    }

    render() {
        const { data, hideDelIcon, hideEditInput } = this.state
      
        return (
            <li
                onMouseEnter={() => this.toggleHideDelIcon(false)}
                onMouseLeave={() => this.toggleHideDelIcon(true)}
                onDoubleClick={() => this.toggleHideEditInput(false)}
            >
                <div className={classNames('view', { hide: !hideEditInput })}>
                    <input
                        className="toggle"
                        type="checkbox"
                        checked={data.completed}
                        onChange={e => this.todoUpdate(e, 'completed')}
                    />
                    <div className={classNames('normal', { completed: data.completed })}>{data.text}</div>
                    <button type="button" className={classNames('destroy', { hide: hideDelIcon })} onClick={this.todoRemove} />
                </div>
                <input
                    className={classNames('edit', { hide: hideEditInput })}
                    value={data.text}
                    onChange={e => this.todoUpdate(e, 'text')}
                    onKeyDown={this.finishNameEdit}
                />
            </li>
        )
    }
}

TodoSingle.propTypes = {
    data: PropTypes.object.isRequired,
    removeTodo: PropTypes.func.isRequired,
    onUpdateTodo: PropTypes.func.isRequired
}

export default enhanceWithClickOutside(TodoSingle)
