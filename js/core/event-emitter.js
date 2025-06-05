/**
 * 事件发射器类
 * 用于处理应用内部事件的订阅和发布
 */
export class EventEmitter {
    constructor() {
        this.events = {};
    }

    /**
     * 订阅事件
     * @param {string} eventName - 事件名称
     * @param {Function} listener - 监听器函数
     * @returns {Function} - 取消订阅的函数
     */
    on(eventName, listener) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName].push(listener);

        // 返回取消订阅的函数
        return () => {
            this.off(eventName, listener);
        };
    }

    /**
     * 取消事件订阅
     * @param {string} eventName - 事件名称
     * @param {Function} listenerToRemove - 要移除的监听器函数
     */
    off(eventName, listenerToRemove) {
        if (!this.events[eventName]) {
            return;
        }

        this.events[eventName] = this.events[eventName].filter(
            listener => listener !== listenerToRemove
        );
    }

    /**
     * 触发事件
     * @param {string} eventName - 事件名称
     * @param {...any} args - 传递给监听器的参数
     */
    emit(eventName, ...args) {
        if (!this.events[eventName]) {
            return;
        }

        this.events[eventName].forEach(listener => {
            try {
                listener(...args);
            } catch (error) {
                console.error(`Error in event listener for ${eventName}:`, error);
            }
        });
    }

    /**
     * 只订阅一次事件
     * @param {string} eventName - 事件名称
     * @param {Function} listener - 监听器函数
     */
    once(eventName, listener) {
        const onceWrapper = (...args) => {
            listener(...args);
            this.off(eventName, onceWrapper);
        };

        return this.on(eventName, onceWrapper);
    }

    /**
     * 移除所有事件监听器
     * @param {string} [eventName] - 可选的事件名称，如果不提供则移除所有事件的所有监听器
     */
    removeAllListeners(eventName) {
        if (eventName) {
            delete this.events[eventName];
        } else {
            this.events = {};
        }
    }
} 